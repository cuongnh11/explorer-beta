import { useLanguage } from '@providers/language-provider';
import classes from 'classnames';
import { toUpper } from 'lodash';
import React, { useState } from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import { Globe } from 'react-feather';

const LanguageSelectItem = ({ value, label, onChangeLanguage, active }: any) => {
    const onClick = (e: any) => {
        e.stopPropagation();
        onChangeLanguage(value);
    };

    const className = classes('toggle-language__item px-3 py-2', {
        selected: active,
    });

    return (
        <div className={className} onClick={onClick}>
            {label}
        </div>
    );
};

const ToggleLanguage = () => {
    const { language, changeLanguage } = useLanguage();
    const [open, setOpen] = useState(false);

    const onChangeLanguage = (value: 'en' | 'vi') => {
        setOpen(false);
        changeLanguage(value);
    };

    const options = React.useMemo(
        () => [
            {
                active: language === 'en',
                label: 'English',
                value: 'en',
            },
            {
                active: language === 'vi',
                label: 'Tiếng Việt',
                value: 'vi',
            },
        ],
        [language]
    );

    const onHide = () => {
        setOpen(false);
    };

    const onOpen = () => {
        setOpen(true);
    };

    const renderSelectLanguage = () => {
        return (
            <div className="toggle-language--menu shadow-sm py-1 rounded">
                {options.map((option, index) => (
                    <LanguageSelectItem key={index} {...option} onChangeLanguage={onChangeLanguage} />
                ))}
            </div>
        );
    };

    return (
        <OverlayTrigger
            overlay={renderSelectLanguage()}
            onToggle={onHide}
            show={open}
            placement="bottom"
            rootClose
            trigger="click"
        >
            <span onClick={onOpen} className="toggle-language d-flex align-items-center">
                <Globe size={24} className="text-primary" />
                <span className="d-md-none ml-8">{toUpper(language)}</span>
            </span>
        </OverlayTrigger>
    );
};

export default ToggleLanguage;
