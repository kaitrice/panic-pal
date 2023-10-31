import {
    Text,
    View,
} from 'react-native'

const Message = ( {type, content}) => (
    <View style={styles.container}>
        <Text style={styles[type]}>
            {content}
        </Text>
    </View>
)

Message.propTypes = {
    type: PropTypes.oneOf(['bot', 'user']).isRequired,
    content: PropTypes.string.isRequired,
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    bot: {
        backgroundColor: '#80B9E233',
        padding: '10px',
        borderRadius: '10px',
        marginBottom: '10px',
        alignSelf: 'flex-start',
    },
    user: {
        backgroundColor: '#FCFCFC',
        padding: '10px',
        borderRadius: '10px',
        marginBottom: '10px',
        alignSelf: 'flex-end',
    },
})

export default Message
