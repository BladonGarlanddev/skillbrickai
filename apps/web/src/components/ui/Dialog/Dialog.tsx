import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import clsx from 'clsx';
import styles from './Dialog.module.scss';

export function Dialog(props: DialogPrimitive.DialogProps) {
  return <DialogPrimitive.Root {...props} />;
}

export function DialogTrigger(props: DialogPrimitive.DialogTriggerProps) {
  return <DialogPrimitive.Trigger asChild {...props} />;
}

export function DialogContent({
  children,
  className,
  ...props
}: DialogPrimitive.DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={styles.overlay} />
      <DialogPrimitive.Content className={clsx(styles.content, className)} {...props}>
        {children}
        <DialogPrimitive.Close className={styles.close}>
          <X style={{ width: '1rem', height: '1rem' }} />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={clsx(styles.header, className)} {...props} />;
}

export function DialogTitle(props: DialogPrimitive.DialogTitleProps) {
  return <DialogPrimitive.Title className={styles.title} {...props} />;
}

export function DialogDescription(props: DialogPrimitive.DialogDescriptionProps) {
  return <DialogPrimitive.Description className={styles.description} {...props} />;
}
