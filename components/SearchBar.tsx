import {TextInput, TouchableOpacity, View} from "react-native";
import {useState} from "react";
import {router, useLocalSearchParams} from "expo-router";
import {Image} from "expo-image";
import {images} from "@/constanst";

const SearchBar = () => {
    const params = useLocalSearchParams<{query?: string}>()
    const [query, setQuery] = useState(params.query)

    const handleSearch = (text: string) => {
        setQuery(text);

        if(!text) router.setParams({query: undefined});
    };

    const handleSubmit = () => {
        if(query.trim()) router.setParams({query});
    }

    return (
        <View className="searchbar">
            <TextInput
                className="flex-1 p-5"
                placeholder="search for pizzas, burgers ..."
                value={query}
                onChangeText={handleSearch}
                onSubmitEditing={handleSubmit}
                returnKeyType="search"
                placeholderTextColor="#A0A0A0"
            />

            <TouchableOpacity className="pr-5" onPress={() => router.setParams({query})}>
                <Image
                    source={images.search}
                    style={{width: 24, height: 24}}
                    resizeMode="contain"
                    tintColor="#5D5F6D"
                />
            </TouchableOpacity>
        </View>
    )
}

export default SearchBar;