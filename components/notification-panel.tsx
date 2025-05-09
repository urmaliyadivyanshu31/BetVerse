"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Bet Won!",
      description: "Your bet on Mumbai Indians has won. $45.60 has been added to your balance.",
      time: "2 hours ago",
      read: false,
      icon: <Trophy className="h-5 w-5 text-green-500" />,
    },
    {
      id: 2,
      title: "Match Starting Soon",
      description: "RCB vs KKR match starts in 30 minutes. Don't miss it!",
      time: "30 minutes ago",
      read: false,
      icon: <Clock className="h-5 w-5 text-primary" />,
    },
    {
      id: 3,
      title: "Funds Added",
      description: "You've successfully added $100 to your wallet.",
      time: "1 day ago",
      read: true,
      icon: <DollarSign className="h-5 w-5 text-blue-500" />,
    },
  ])

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  return (
    <div className="absolute right-0 mt-2 w-80 bg-card rounded-lg shadow-lg border border-border z-50">
      <div className="p-4 border-b border-border">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Notifications</h3>
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              "p-4 border-b border-border hover:bg-accent/50 transition-colors",
              notification.read ? "opacity-70" : "",
            )}
          >
            <div className="flex">
              <div className="mr-3 mt-1">{notification.icon}</div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  {!notification.read && <span className="h-2 w-2 bg-primary rounded-full"></span>}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 text-center border-t border-border">
        <Button variant="ghost" size="sm" className="text-sm text-primary">
          View All Notifications
        </Button>
      </div>
    </div>
  )
}
