#!/usr/bin/env bash

pkgName=$npm_package_name
if [ -z $pkgName ];then
  echo 'package name of package.json empty!'
  exit 1
fi

# https://stackoverflow.com/questions/1064499/how-to-list-all-git-tags
ver=$( git tag -l "v*" --sort=-version:refname | head -n 1 )
curDir=$(dirname $(readlink -f "$0"))
appPath=$(dirname $curDir)
target="../${pkgName}-${ver}.tar.gz"
path=$(readlink -f "$target")

time tar --totals -czpf $target --exclude=*.ts --exclude=*.swp *
if [ $? -eq 0 ];then
  echo -e "\nCompressed file: \"${path}\""
else
  echo -e "\nCompress fail"
fi

