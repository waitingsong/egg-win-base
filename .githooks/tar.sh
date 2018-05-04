#!/usr/bin/env bash

name=$npm_package_name
if [ -z name ];then
  echo 'package name of package.json empty!'
  exit 1
fi

base=$(dirname $(readlink -f "$0"))
target="../${name}.tar.gz"
path=$(readlink -f "$target")

time tar --totals -czpf $target --exclude=*.ts --exclude=*.swp *
if [ $? -eq 0 ];then
  echo -e "\nCompressed file: \"${path}\""
else
  echo -e "\nCompress fail"
fi

