#!/bin/sh
branch_name=$1
git fetch
git rebase origin/$branch_name
