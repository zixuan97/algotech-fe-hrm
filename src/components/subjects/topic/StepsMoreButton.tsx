import React from 'react';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CopyOutlined,
  DeleteOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { Button, Dropdown, Menu, MenuProps, Modal } from 'antd';
import { Step } from 'src/models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  duplicateStepInStepsArr,
  reorderStepsArr,
  swapStepsinStepsArr
} from './topicHelper';
import { deleteStep, updateStepsOrder } from 'src/services/topicService';

type StepsMoreButtonProps = {
  currStep: Step;
  steps: Step[];
  updateSelectedStep: React.Dispatch<React.SetStateAction<Step | null>>;
  refreshTopic: () => void;
};

enum StepMoreKeys {
  DUPLICATE = 'DUPLICATE',
  DELETE = 'DELETE',
  MOVE_UP = 'MOVE_UP',
  MOVE_DOWN = 'MOVE_DOWN'
}

const StepsMoreButton = ({
  currStep,
  steps,
  updateSelectedStep,
  refreshTopic
}: StepsMoreButtonProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = React.useState<boolean>(false);
  const [deleteStepLoading, setDeleteStepLoading] =
    React.useState<boolean>(false);

  const currIdx = steps.findIndex((step) => step.id === currStep.id);

  const duplicateStepApiCall = (idxToInsert: number) => {
    updateStepsOrderApiCall(
      duplicateStepInStepsArr({ ...currStep, id: -1 }, idxToInsert, steps)
    );
  };

  const deleteStepApiCall = (idxToDelete: number, newSteps: Step[]) => {
    setDeleteStepLoading(true);
    asyncFetchCallback(
      deleteStep(currStep.id),
      () => {
        updateStepsOrderApiCall(newSteps, () =>
          updateSelectedStep((currSelectedStep) => {
            if (
              currSelectedStep === null ||
              currSelectedStep.id !== currStep.id
            ) {
              return currSelectedStep;
            }
            const updatedIdx =
              idxToDelete === steps.length - 1
                ? idxToDelete - 1
                : idxToDelete + 1;
            return steps[updatedIdx];
          })
        );
      },
      () => void 0,
      { updateLoading: setDeleteStepLoading }
    );
  };

  const updateStepsOrderApiCall = (newSteps: Step[], callback?: () => void) => {
    asyncFetchCallback(updateStepsOrder(newSteps), (res) => {
      refreshTopic();
      callback?.();
    });
  };

  const duplicateCurrStep = () => {
    const newSteps = [...steps];
    const idxToInsert =
      newSteps.findIndex((newStep) => newStep.id === currStep.id) + 1;
    duplicateStepApiCall(idxToInsert);
  };

  const deleteCurrStep = () => {
    const newSteps = [...steps];
    const idxToDelete = newSteps.findIndex(
      (newStep) => newStep.id === currStep.id
    );
    newSteps.splice(idxToDelete, 1);
    deleteStepApiCall(idxToDelete, reorderStepsArr(newSteps));
  };

  const moveCurrStepUp = () => {
    if (currIdx === 0) return;
    updateStepsOrderApiCall(swapStepsinStepsArr(currIdx, currIdx - 1, steps));
  };

  const moveCurrStepDown = () => {
    if (currIdx === steps.length - 1) return;
    updateStepsOrderApiCall(swapStepsinStepsArr(currIdx, currIdx + 1, steps));
  };

  const stepsMoreMenuItems: MenuProps['items'] = [
    {
      label: 'Duplicate',
      key: StepMoreKeys.DUPLICATE,
      icon: <CopyOutlined />,
      onClick: () => duplicateCurrStep()
    },
    {
      label: 'Delete',
      key: StepMoreKeys.DELETE,
      icon: <DeleteOutlined />,
      onClick: () => setDeleteModalOpen(true)
    },
    ...(currIdx !== 0
      ? [
          {
            label: 'Move Up',
            key: StepMoreKeys.MOVE_UP,
            icon: <ArrowUpOutlined />,
            onClick: () => moveCurrStepUp()
          }
        ]
      : []),
    ...(currIdx !== steps.length - 1
      ? [
          {
            label: 'Move Down',
            key: StepMoreKeys.MOVE_DOWN,
            icon: <ArrowDownOutlined />,
            onClick: () => moveCurrStepDown()
          }
        ]
      : [])
  ];

  return (
    <>
      <Modal
        title='Confirm Delete Step'
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onOk={() => deleteCurrStep()}
        okButtonProps={{
          loading: deleteStepLoading
        }}
      >
        Are you sure you want to delete this step?
      </Modal>
      <Dropdown
        overlay={<Menu items={stepsMoreMenuItems} />}
        trigger={['click']}
      >
        <Button icon={<MoreOutlined />} type='text' />
      </Dropdown>
    </>
  );
};

export default StepsMoreButton;
