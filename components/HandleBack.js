import React, { Component } from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';

import { withNavigation } from 'react-navigation';

/**
 * This component can be used throughout the app to help with navigation.
 * It is used to deal with the hardware back button press. In order to prevent
 * accidental closure of the app when the back button is pressed, this component
 * is used to create alert boxes. It is also used to disable back navigation from
 * home screen to the login screen.
 */
class HandleBack extends Component {
    constructor(props) {
        super(props);

        this.didFocus = this.props.navigation.addListener('didFocus', payload => {
            BackHandler.addEventListener('hardwareBackPress', this.onBack)
        })
    }
    componentDidMount() {
        this.willBlur = this.props.navigation.addListener('willBlur', payload => {
            BackHandler.removeEventListener('hardwareBackPress', this.onBack)
        })
    }

    /**
     * This method is the main logic of this component. The functionality of
     * back button can be written in this method when using this method.
     * This allows a specific behaviour for every screen as seen throughout the app.
     */
    onBack = () => {
        return this.props.onBack();
    }

    UNSAFE_componentWillUnmount() {
        this.didFocus.remove();
        this.willBlur.remove();
        BackHandler.removeEventListener('hardwareBackPress', this.onBack);
    }

    render() {
        return this.props.children;
    }
}

export default withNavigation(HandleBack);