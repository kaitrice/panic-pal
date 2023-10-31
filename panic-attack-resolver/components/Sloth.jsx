import React from 'react'
import PropTypes from 'prop-types'
import { Image, View } from 'react-native'

// Import the three sloth image variants
// import Sloth1 from 'path_to_assets/sloth1.png'
// import Sloth2 from 'path_to_assets/sloth2.png'
// import Sloth3 from 'path_to_assets/sloth3.png'

const Sloth = ({ variant }) => {
    let slothImage;
    switch (variant) {
        case 'variant1':
            // slothImage = Sloth1;
            break;
        case 'variant2':
            // slothImage = Sloth2;
            break;
        case 'variant3':
            // slothImage = Sloth3;
            break;
        default:
            // slothImage = Sloth1;
            break;
    }

    return (
        <View style={styles.container}>
            <Image source={slothImage} style={styles.image} />
        </View>
    );
};

Sloth.propTypes = {
    variant: PropTypes.oneOf(['variant1', 'variant2', 'variant3']).isRequired,
}

const styles = {
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 64,
        height: 64,
        resizeMode: 'contain',
    },
}

export default Sloth