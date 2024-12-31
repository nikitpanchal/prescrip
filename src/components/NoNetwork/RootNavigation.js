import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef()

export function navigate(name, params) {
    let raead = navigationRef.isReady();
    if (raead) {
        navigationRef.navigate(name, params);
    }
}