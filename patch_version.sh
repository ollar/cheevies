#!/bin/sh

echo "git push"
git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"
git checkout ${TRAVIS_BRANCH}

npm version patch -m "Version up to %s"

git push https://${GH_TOKEN}@github.com/${TRAVIS_REPO_SLUG}