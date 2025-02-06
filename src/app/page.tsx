'use client';

import LoginForm from '@/components/LoginForm';
import Image from 'next/image';
import styled, { css } from 'styled-components';

const Container = styled.div`
  display: grid;
  width: 100%;
  background: linear-gradient(rgba(196, 102, 0, 0.6), rgba(155, 89, 182, 0.6));
  min-height: 100vh;
  grid-template-areas: 'content-container image-container';
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 1fr;

  @media ${({ theme: { device } }) => device.tablet} {
    grid-template-areas:
      'image-container'
      'content-container';
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 500px;
  }
`;

const ImageContainer = styled.section`
  align-items: center;
  display: flex;
  flex-direction: column;
  grid-area: image-container;
  justify-content: space-between;
  position: relative;
`;

const StyledImage = styled(Image)`
  object-fit: cover;
  object-position: center;
`;

const ContentContainer = styled.section`
  display: grid;
  place-items: center;
  grid-area: content-container;
  margin: 2rem;
`;

const Content = styled.div`
  display: flex;
  border-radius: 0.75rem;
  flex-direction: column;
  padding: 2rem;

  ${({ theme: { colors } }) => css`
    color: ${colors.black};
  `};

  h1 {
    font-size: 2rem;
    margin: 1rem 0px;

    @media ${({ theme: { device } }) => device.tablet} {
      font-size: 1rem;
    }
  }
`;

export default function LoginPage() {
  return (
    <Container>
      <ImageContainer>
        <StyledImage
          alt={'dog_on_fuschia_background'}
          fill
          sizes="50vw"
          priority
          src={'/dog_on_fuschia_background.jpg'}
        />
      </ImageContainer>
      <ContentContainer>
        <Content>
          <h1>Login to find your perfect match!</h1>
          <LoginForm />
        </Content>
      </ContentContainer>
    </Container>
  );
}
