import { createDrawerNavigator } from 'react-navigation-drawer';

import DashboardStackNavigator from './DashboardStackNavigator';

/**
 * This is a drawer navigator. It is the parent navigator
 * for the home navigator. It can be used to add more screens
 * that provide more functionality to the app, such as settings and
 * a user profile page.
 */
const DashboardNavigator = createDrawerNavigator(
    {
        Home: {
            screen: DashboardStackNavigator,
        }
    }
);

export default DashboardNavigator;