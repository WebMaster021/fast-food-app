import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import { images } from "@/constanst";
import {Image} from "expo-image";

const CartButton = () => {
    const totalIitems = 10;

    return (
        <TouchableOpacity className="cart-btn" onPress={() => {}}>
            <Image source={images.bag} style={{ width: 20, height: 20 }} contentFit={"contain"} />

            {totalIitems > 0 && (
              <View className="cart-badge">
                  <Text className="small-bold text-white">{totalIitems}</Text>
              </View>
            )}
        </TouchableOpacity>
    )
}

export default CartButton;