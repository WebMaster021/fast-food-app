import {View, Text, KeyboardAvoidingView, Platform, ScrollView, Dimensions} from 'react-native';
import React from 'react';
import {SafeAreaView} from "react-native-safe-area-context";
import {Redirect, Slot} from "expo-router";
import {ImageBackground} from "expo-image";
import {images} from "@/constanst";
import {Image} from 'react-native';
import CustomInput from "@/components/Custominput";
import CustomButton from "@/components/Custombutton";
import useAuthStore from "@/store/auth.store";

export default function AuthLayout() {
    const {isAuthenticated} = useAuthStore();

    if(isAuthenticated) return <Redirect href='/' />
    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView className="bg-white h-full" keyboardShouldPersistTaps = "handled">
                <View className="w-full relative" style={{ height: Dimensions.get( 'screen' ).height / 2.25}}>
                    <ImageBackground source={images.loginGraphic} style={{width: "100%", height: "100%"}} className=" rounded-b-lg" contentFit={"fill"}/>
                    <Image source={images.logo} className="self-center w-48 h-48 absolute -bottom-16 z-10" />
                </View>


            <Slot />
            </ScrollView>
        </KeyboardAvoidingView>
    )
}