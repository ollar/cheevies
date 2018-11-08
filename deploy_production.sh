#!/bin/bash

env=$1   # [production, development, testing]

echo $env

ember deploy $env --verbose