#!/bin/bash -ilex
gulp app
gulp tpl

#ionic platforms add ios
#ionic platforms add android
ionic build
fir build_ipa platforms/ios -p
fir publish platforms/android/build/outputs/apk/android-armv7-debug.apk