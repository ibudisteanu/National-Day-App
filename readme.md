# Install Android SDK

    sudo apt update && sudo apt install android-sdk


In case you have echo $JAVA_HOME null or problems with JDK 1.8, install (https://www.youtube.com/watch?v=7LFfYQsezh8)

    sudo apt-get-repository ppa:webupd8team/java
    sudo apt-get update
    sudo apt-get install oracle-java8-installer
    sudo apt-get install oracle-java8-set-default
    java -version
    
In case have echo $ANDROID_HOME null follow the following tutorial    
    
nano ~/.profile
export ANDROID_HOME="~/Android/Sdk"
export PATH=$PATH:~/Android/Sdk/tools:~/Android/Sdk/platform-tools
source ~/.profile
echo $ANDROID_HOME    


## Install Grandle  

    https://www.vultr.com/docs/how-to-install-gradle-on-ubuntu-16-10


# Open Emulator

Use Android Studio to open the AVD emulator


#### Use Android Studio to manage AVD and add a new device

    Tools => Manage AVD => ADD Device
    Device => Options => Wipe  Data
    Device => Options => Cold Boot

# Open it

    source ~/.bash_profile
    react-native run-android




# Tutorial for publish it on Android Play Store

    https://facebook.github.io/react-native/docs/signed-apk-android

optionally this
 
    https://android.jlelse.eu/preparing-a-reach-native-android-app-for-production-f063413d5633
    
to build it again

    $ cd android
    $  ./gradlew assembleRelease      



