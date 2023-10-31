import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';

const Header = ({ title, subtitle }) => (
    <View>
        <Text>{title}</Text>
        <Text>{subtitle}</Text>
    </View>
);

Header.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
};


export default Header;
