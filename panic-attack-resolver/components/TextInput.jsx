import {
    StyleSheet,
    View,
    Text,
} from 'react-native'


const TextInput = ({ mic, content }) => (
    <View style={styles.container}>
        <Text>{content}</Text>
    </View>
)

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
})

export default TextInput
