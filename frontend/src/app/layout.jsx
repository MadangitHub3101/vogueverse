import './globals.css'

export const metadata = {
  title: 'VogueVerse',
  description: 'Premium Apparel Store',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'sans-serif', background: '#f9f9f9' }}>
        {children}
      </body>
    </html>
  )
}