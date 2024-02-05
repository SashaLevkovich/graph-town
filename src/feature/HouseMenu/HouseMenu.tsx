import { Button } from 'antd';

type TypeProps = {
  scene: { mountDraftHouseOnScene: (title: string) => void };
};

export const HouseMenu = ({ scene }: TypeProps) => {
  const handleClick = (title: string) => scene.mountDraftHouseOnScene(title);

  return (
    <ul className='houses-menu'>
      <Button onClick={() => handleClick('castle')}>Castle</Button>
      <Button onClick={() => handleClick('pizzashop')}>Pizza shop</Button>
      <Button onClick={() => handleClick('shack')}>Shack</Button>
      <Button onClick={() => handleClick('woodhouse')}>Woodhouse</Button>
    </ul>
  );
};
