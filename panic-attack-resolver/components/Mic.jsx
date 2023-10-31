// import React from 'react'
// import PropTypes from 'prop-types'
// import { Image, View } from 'react-native'

// const Mic = ({ variant }) => {
//     let mic;
//     switch (variant) {
//         case 'on':
//             mic = variant1;
//             break;
//         case 'off':
//             mic = variant2;
//             break;
//         case 'neutral':
//             mic = variant3;
//             break;
//         default:
//             mic = variant3;
//             break;
//     }

//     return (
//         <View style={styles.container}>
//             <Image source={slothImage} style={styles.image} />
//         </View>
//     );
// };

// Mic.propTypes = {
//     variant: PropTypes.oneOf(['variant1', 'variant2', 'variant3', 'variant4', 'variant5']).isRequired,
// }

// const styles = {
//     container: {
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     image: {
//         width: 64,
//         height: 64,
//         resizeMode: 'contain',
//     },
// }

// export default Mic