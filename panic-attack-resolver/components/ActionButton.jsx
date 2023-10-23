import React from 'react';
import PropTypes from 'prop-types';
import { Button, View } from 'react-native';

const ActionButton = ({ label, onPress, buttonStyle }) => (
    <View style={buttonStyle}>
        <Button title={label} onPress={onPress} />
    </View>
);

ActionButton.propTypes = {
    label: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    buttonStyle: PropTypes.object.isRequired,
};

export default ActionButton;