import React from 'react';
import { useMediaQuery } from '@chakra-ui/react';
import { useHomeLogic } from './logic/useHomeLogic';
import { HomeUi } from './components/HomeUi';

export default function Home() {
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  const logic = useHomeLogic();
  return (
    <HomeUi isMobile={isMobile} {...logic} />
  );
}
