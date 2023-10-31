import React from 'react'
import PropTypes from 'prop-types'
import { Image, View } from 'react-native'

// Import the three sloth image variants
import Sloth1 from '../assets/sloths/sloth-close_eyes.png';
import Sloth2 from '../assets/sloths/sloth-side.png'
import Sloth3 from '../assets/sloths/sloth-top.png'
import Sloth4 from '../assets/sloths/sloth-tree-closed_eyes.png'
import Sloth5 from '../assets/sloths/sloth-tree-opened_eyes.png'

const Sloth = ({ variant }) => {
    let slothImage;
    switch (variant) {
        case 'variant1':
            slothImage = Sloth1;
            break;
        case 'variant2':
            slothImage = Sloth2;
            break;
        case 'variant3':
            slothImage = Sloth3;
            break;
        case 'variant4':
            slothImage = Sloth4;
            break;
        case 'variant5':
            slothImage = Sloth5;
            break;
        default:
            slothImage = Sloth1;
            break;
    }

    return (
        <View style={styles.container}>
            <Image source={slothImage} style={styles.image} />
        </View>
    );
};

Sloth.propTypes = {
    variant: PropTypes.oneOf(['variant1', 'variant2', 'variant3', 'variant4', 'variant5']).isRequired,
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