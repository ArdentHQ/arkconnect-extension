import { Button } from '@/shared/components'
import { MouseEventHandler } from 'react'
import { useTranslation } from 'react-i18next'

const SendModalButton = ({onClick}: {onClick: MouseEventHandler<HTMLButtonElement>}) => {
    const { t } = useTranslation()

    return (
        <Button variant='secondaryBlack' className='!w-fit !h-fit !py-1.5 !px-3 !text-sm !font-medium' iconTrailing='qr-code' iconClass='h-4 w-4' onClick={onClick}>
            {t('PAGES.SEND.QR_MODAL.UPLOAD_QR')}
        </Button>
    )
}

export default SendModalButton