import {Text, View, FlatList, Pressable, TouchableOpacity, ScrollView} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { images, offers} from "@/constanst";
import {Fragment} from "react";
import {Image} from "expo-image";
import cn from 'clsx';
import CartButton from "@/components/CartButton";

export default function index() {
    return (
        <SafeAreaView className="flex-1 bg-white">

            <FlatList
                data={offers}
                renderItem={({item, index}) => {
                    const isEven = index % 2 === 0;

                    return (
                        <View>
                            <Pressable className={cn("offer-card", isEven ? "flex-row-reverse" : "flex-row")} style={{ backgroundColor: item.color }}
                            android_ripple={{ color: "#ffffff22" }}>
                                {({ pressed }) => (
                                    <Fragment>
                                        <View className={"h-full w-1/2"}>
                                            <Image source={item.image} style={{ width: 187, height: 170 }} contentFit={"contain"} />
                                        </View>

                                        <View className={cn("offer-card__info", isEven ? 'pl-10' : 'pr-10')}>
                                            <Text className={"h1-bold text-white leading-tight"}>
                                                {item.title}
                                            </Text>

                                            <Image source={images.arrowRight} style={{ width: 50, height: 20 }} contentFit={"contain"}
                                                tintColor="#ffffff"
                                            />
                                        </View>
                                    </Fragment>
                                )}
                            </Pressable>
                        </View>
                    )
                }}
                contentContainerClassName="pb-28 px-5"
                ListHeaderComponent={() => (
                    <View className="flex-between flex-row w-full my-5">
                        <View className="flex-start">
                            <Text className="small-bold text-primary">DELIVERY TO</Text>
                            <TouchableOpacity className="flex-center flex-row gap-x-1 mt-0.5">
                                <Text className="paragraph-bold text-dark-100">Croatia</Text>
                                <Image source={images.arrowDown} style={{width: 7, height: 7}} contentFit={"contain"} />
                            </TouchableOpacity>
                        </View>

                        <CartButton />
                    </View>
                )}
            />
        </SafeAreaView>
    );
}