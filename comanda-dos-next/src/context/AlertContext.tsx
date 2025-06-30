"use client"

import { createContext, useContext, useState, ReactNode } from 'react';
import toast, { Toaster } from 'react-hot-toast';

type AlertContextType = {
    createAlert: (text: string, className: string) => void,
    alerts: string
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function useAlert() {
    const context = useContext(AlertContext)

    if (!context) {
        throw new Error("useAlert debe usarse dentro del contexto")
    }
    return context
}

export default function AlertProvider({ children }: { children: ReactNode }) {

    const [alerts, setAlerts] = useState('');
    const [alertsClassName, setAlertsClassName] = useState("");

    const createAlert = (text: string, classNames: string) => {
        setAlerts('');
        setTimeout(() => {
            setAlerts(text);
            setAlertsClassName(classNames);
        }, 2);
    };

    return (
        <AlertContext.Provider value={{ createAlert, alerts }}>
            {alerts && (
                <div className={alertsClassName}>
                    {alerts}
                </div>
            )}
            {children}
        </AlertContext.Provider>
    )
}