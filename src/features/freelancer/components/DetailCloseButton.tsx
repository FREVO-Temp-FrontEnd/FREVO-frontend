import { Button } from '@mui/material';
import { X } from 'lucide-react';

export function DetailCloseButton({ onClose }: { onClose: () => void }) {
  return <Button onClick={onClose} startIcon={<X size={17} aria-hidden="true" />} sx={{ display: 'flex', ml: 'auto', mb: 1, minHeight: 44, color: 'text.secondary' }}>Đóng chi tiết</Button>;
}
