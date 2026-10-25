# Oracle Cloud Always Free deployment

This app needs a Node.js server. TMDB powers movie pages, while `data/editorials/*.json` supplies reviews and the editorial API can write new reviews. A static export would lose those features.

The live deployment uses `hollyflixhd-web` in Frankfurt AD-2 (VM.Standard.A1.Flex, 1 OCPU, 6 GB RAM, 46.6 GB boot volume) at `152.70.14.232`. Namecheap BasicDNS has an `@` A record pointing to that IP and a `www` CNAME pointing to the root domain. Caddy serves both names with automatic HTTPS. The Oracle account remains on Free Tier; do not upgrade it or add resources outside the Always Free allowances. The existing domain expires on May 15, 2027, so keeping that custom domain indefinitely requires a separate domain renewal. Check and cancel any former hosting subscription separately if it is no longer needed.

## Oracle instance

- Use the tenancy **home region** and the **VM.Standard.A1.Flex** Always Free eligible shape. A 1 OCPU / 6 GB instance is sufficient to build and run this app. The 1 GB E2 micro shape is a poor fit for an on-instance Next.js build. Keep total A1 usage at or below **2 OCPUs and 12 GB RAM** so the VM remains within Always Free limits after the trial.
- Use Ubuntu 24.04 ARM64, a default boot volume, a public subnet, and an SSH key. Check remaining Always Free compute and block-volume allowance before creating anything else.
- In the VCN security list or network security group, allow TCP 80 and 443 from `0.0.0.0/0`. The default SSH rule allows TCP 22 from anywhere; restrict it to a stable trusted IP when available. Keep port 3000 private.
- Ubuntu's firewall must also allow 80 and 443. On the Oracle Ubuntu image used here, insert an INPUT rule before the final REJECT and persist it with `netfilter-persistent save`. Keep the system and packages updated.

## Install the app

On the VM, install Node.js 22 LTS from Node.js and Caddy from Ubuntu's package repository. Then:

```bash
sudo mkdir -p /opt/hollyflixhd
sudo chown ubuntu:ubuntu /opt/hollyflixhd
cd /opt/hollyflixhd
git clone https://github.com/Dipesh199/HollyFlixHd.git
cd HollyFlixHd/hollyflixhd
npm ci
```

Create `/etc/hollyflixhd.env` with `TMDB_API_KEY`, `NEXT_PUBLIC_SITE_URL=https://hollyflixhd.com`, and any analytics/ad IDs in use. For automatic reviews, set `OLLAMA_API_KEY` to the Free-plan Ollama key and optionally `OLLAMA_MODEL=gemma4:31b`. Keep this key server-side only; never use a `NEXT_PUBLIC_` prefix or commit it. A movie page with no stored review calls the backend, which generates and saves one review for reuse. The initial 1,162 packaged reviews need no API call. The Ollama account must have no purchased credits or automatic billing to uphold the zero-payment requirement; when its included usage is exhausted, new reviews cannot be generated until the allowance resets. Protect the file with `root:ubuntu` ownership and mode `640` so the build can read it but the app cannot change it. Use Unix LF line endings; CRLF makes shell-sourced API keys invalid. The `NEXT_PUBLIC_*` values must be set **before** `npm run build` because Next.js embeds them in the build.

```bash
set -a
. /etc/hollyflixhd.env
set +a
npm run build
sudo cp deploy/hollyflixhd.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now hollyflixhd
curl -I http://127.0.0.1:3000/
```

Install Caddy, then copy `deploy/Caddyfile` to `/etc/caddy/Caddyfile` and reload Caddy. Caddy obtains HTTPS certificates after the domain points to the VM and ports 80/443 are reachable. Until DNS cutover, test with a temporary `:80` Caddy site and the VM's public IP.

## DNS cutover and checks

The current `hollyflixhd.com` A record points to another server. Replace it only after the Oracle copy passes checks via its public IP. Set the root A record to the Oracle public IP and make `www` a CNAME to the root or another A record. Then verify:

```bash
curl -I https://hollyflixhd.com/
curl -I https://hollyflixhd.com/movies
curl -I https://hollyflixhd.com/sitemap.xml
sudo systemctl status hollyflixhd caddy
```

Check one movie page with an existing editorial and confirm `/api/editorial?slug=...` serves it. Monitor `journalctl -u hollyflixhd -f` for runtime errors.

## Updating and preserving reviews

`data/editorials` is writable by the app; reviews generated after deployment are not in Git until deliberately committed. Back up that directory before redeploying or replacing the VM. A plain `git pull` leaves untracked reviews in place, but a future repository file with the same name can conflict. Back up the directory separately, then run `git pull`, `npm ci`, `npm run build`, and `sudo systemctl restart hollyflixhd`.

## References

- [Oracle Always Free resources](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm)
- [Next.js 14 self-hosting](https://nextjs.org/docs/14/app/building-your-application/deploying)
- [Caddy install](https://caddyserver.com/docs/install)
