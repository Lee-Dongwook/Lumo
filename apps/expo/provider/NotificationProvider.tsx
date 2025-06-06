import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'

import * as Notifications from 'expo-notifications'
import { registerForPushNotificationsAsync } from '../utils/registerForPushNotificationsAsync'

interface NotificationProviderType {
  expoPushToken: string | null
  notification: Notifications.Notification | null
  error: Error | null
}

interface NotificationProviderProps {
  children: ReactNode
}

const NotificationContext = createContext<NotificationProviderType | undefined>(
  undefined,
)

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error(
      'useNotification must be used within a NotificationProvider',
    )
  }
  return context
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null)
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const notificationListener = useRef<Notifications.EventSubscription>()
  const responseListener = useRef<Notifications.EventSubscription>()

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => setExpoPushToken(token),
      (error) => setError(error),
    )

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(
          '🔔 Notification Received while this app is running ',
          notification,
        )
        setNotification(notification)
      })

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          '🔔 Notification Response: user interacts with a notification',
          JSON.stringify(response, null, 2),
          JSON.stringify(response.notification.request.content.data, null, 2),
        )
        // Handle the notification response here
      })

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        )
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current)
      }
    }
  }, [])

  return (
    <NotificationContext.Provider
      value={{ expoPushToken, notification, error }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
