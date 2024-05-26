import Modal from '@/components/Modal';
import './globals.css';

export const metadata = {
  title: 'Trello Clone',
  description: 'Generated by Orange',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F5F6F8]">{children}</body>

      <Modal />
    </html>
  );
}
