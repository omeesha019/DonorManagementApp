import React from 'react';
import { ConfirmationDialog } from '@ellucian/react-design-system/core';

type ConfirmationDialogType = {
  dialogOpen: boolean | string;
  primaryText: string;
  secondaryText: string;
  primaryOnClick: Function;
  secondaryOnClick: Function;
  title: string;
  contentText: string;
};

const Confirmation = (props: ConfirmationDialogType) => {
  const {
    dialogOpen,
    primaryText,
    secondaryText,
    primaryOnClick,
    secondaryOnClick,
    title,
    contentText
  } = props;
  return (
    <ConfirmationDialog
      contentText={contentText}
      open={dialogOpen}
      primaryActionOnClick={primaryOnClick}
      primaryActionText={primaryText}
      secondaryActionOnClick={secondaryOnClick}
      secondaryActionText={secondaryText}
      title={title}
      id='dialog_container'
      PaperProps={{
        id: 'dialog_paper'
      }}
    />
  );
};

export default Confirmation;
