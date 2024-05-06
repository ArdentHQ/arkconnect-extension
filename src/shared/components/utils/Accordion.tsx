import { ReactNode } from 'react';
import cn from 'classnames';
import { twMerge } from 'tailwind-merge';
import { Icon } from '@/shared/components';

export const Accordion = ({ title, children, isOpen, setIsOpen, className }: {
  title: ReactNode | string;
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  className?: string;
}) => {
  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={twMerge('border rounded-xl border-theme-secondary-200 bg-white dark:border-theme-secondary-500 dark:bg-subtle-black dark:shadow-secondary-dark', className)}>
      <div
        className="flex justify-between items-center px-3 py-4 cursor-pointer"
        onClick={toggleAccordion}
      >
        {title}
        <Icon icon="arrow-down" className={cn('w-5 h-5 text-light-black dark:text-white', {'rotate-180': isOpen})} />
      </div>
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } transition-all duration-500 ease-in-out`}
      >
        <div className="pb-4 px-4 flex flex-col gap-4">
          <hr className='text-theme-secondary-200 dark:text-theme-secondary-600' />
          {children}
        </div>
      </div>
    </div>
  );
};
