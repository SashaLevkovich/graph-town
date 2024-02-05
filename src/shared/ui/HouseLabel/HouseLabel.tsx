import { ChangeEvent, useState } from 'react';

import { Button, Form, Input, Spin } from 'antd';
import cn from 'classnames';

import './HouseLabel.css';

type TProps = {
  isMount: boolean;
  defaultName: string;
  onSave: () => void;
  onChangeName: (name: string) => void;
};

export const HouseLabel: React.FC<TProps> = ({
  defaultName,
  isMount: defaultMount,
  onChangeName,
  onSave,
}) => {
  const [isMount, setIsMount] = useState(defaultMount);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(defaultName);

  const handleSaveHouse = async () => {
    const nameIsEmpty = !Boolean(title);

    if (nameIsEmpty) {
      setError('Имя не может быть пустым');
      return;
    }

    if (error) return;
    onSave();
    setIsMount(true);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const name = e.target.value;
    setTitle(name);

    onChangeName(name);
  };

  return (
    <Form className='house-label' onFinish={handleSaveHouse}>
      <Form.Item className='input-house-address-container' rules={[{ required: true }]}>
        <Input
          disabled={isMount}
          className={cn('input-house-address')}
          placeholder='Address'
          value={title}
          status={error ? 'error' : ''}
          onChange={handleNameChange}
          suffix={loading ? <Spin size='small' /> : <></>}
        />
        {error && <div className='ant-form-item-explain-error'>{error}</div>}
      </Form.Item>

      {!isMount && (
        <Button
          disabled={loading || Boolean(error)}
          htmlType='submit'
          onSubmit={() => console.log('Submit!')}
          onPointerDown={handleSaveHouse}
        >
          Save
        </Button>
      )}
    </Form>
  );
};
