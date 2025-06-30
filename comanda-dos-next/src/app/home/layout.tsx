import { ReactNode } from "react"

import Footer from '@/tools/tools/Footer'

export default function LayoutHome({ children }: { children: ReactNode }) {
    return (
        <div>
            <Footer>
                <div>Esto es un layout</div>
                {children}
            </Footer>
        </div>
    )
}