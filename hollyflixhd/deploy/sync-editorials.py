#!/usr/bin/env python3
"""Copy valid, newly generated reviews from the persistent volume to GitHub."""

import json
import os
import shutil
import subprocess
from pathlib import Path

SOURCE = Path('/data/hollyflixhd/editorials')
CHECKOUT = Path('/opt/hollyflixhd-editorial-sync')
DESTINATION = CHECKOUT / 'hollyflixhd/data/editorials'
ARCHIVE = CHECKOUT / 'hollyflixhd/data/editorials_archive'
REMOTE = 'git@github.com:Dipesh199/HollyFlixHd.git'
SSH_KEY = '/root/.ssh/hollyflixhd-editorial-sync'
VALID_RATINGS = {'Must Watch', 'Worth Watching', 'Skip It', 'Cult Classic'}
GIT_ENV = dict(os.environ, GIT_SSH_COMMAND=f'ssh -i {SSH_KEY} -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes')


def git(*args):
    return subprocess.run(['git', *args], cwd=CHECKOUT, env=GIT_ENV, check=True, capture_output=True, text=True)


def valid_review(path):
    if path.is_symlink() or not path.is_file() or path.stat().st_size == 0:
        return False
    try:
        review = json.loads(path.read_text(encoding='utf-8'))
    except (OSError, UnicodeError, json.JSONDecodeError):
        return False
    return (isinstance(review, dict) and isinstance(review.get('editorial'), str)
            and bool(review['editorial'].strip()) and review.get('editorRating') in VALID_RATINGS)


def main():
    if not SOURCE.is_dir():
        raise RuntimeError(f'Persistent editorial directory is missing: {SOURCE}')
    if not (CHECKOUT / '.git').is_dir():
        subprocess.run(['git', 'clone', REMOTE, str(CHECKOUT)], env=GIT_ENV, check=True)

    for attempt in range(3):
        git('fetch', 'origin', 'main')
        git('checkout', '-B', 'main', 'origin/main')
        DESTINATION.mkdir(parents=True, exist_ok=True)
        added = 0
        skipped = 0
        for source in SOURCE.glob('*.json'):
            if not valid_review(source):
                skipped += 1
                continue
            destination = DESTINATION / source.name
            if not (ARCHIVE / source.name).exists() and not destination.exists():
                shutil.copy2(source, destination)
                added += 1
        git('add', '--', 'hollyflixhd/data/editorials')
        staged = git('diff', '--cached', '--name-only').stdout.strip()
        if not staged:
            print(f'No new reviews; skipped {skipped} invalid files')
            return
        git('-c', 'user.name=HollyFlixHD Editorial Sync', '-c', 'user.email=editorials@hollyflixhd.com',
            'commit', '-m', 'chore: sync generated editorials')
        pushed = subprocess.run(['git', 'push', 'origin', 'HEAD:main'], cwd=CHECKOUT, env=GIT_ENV, capture_output=True, text=True)
        if pushed.returncode == 0:
            print(f'Pushed {added} new reviews; skipped {skipped} invalid files')
            return
        if attempt == 2:
            raise RuntimeError(f'Could not push editorials after three attempts: {pushed.stderr[-500:]}')


if __name__ == '__main__':
    main()
