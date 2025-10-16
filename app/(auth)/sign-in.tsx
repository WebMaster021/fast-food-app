import {View, Text, Button} from 'react-native';
import {router} from "expo-router";

const SignIn = () => {
    return (
        <View>
            <Text>Sign in</Text>
            <Button title="Sign in" onPress={() => router.push("/sign-up")} />
        </View>
    )
}

export default SignIn;