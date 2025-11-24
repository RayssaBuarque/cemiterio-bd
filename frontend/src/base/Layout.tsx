import styled from 'styled-components';
import GlobalStyle from '../styles/global';
import SideBar from './Sidebar';
import { PropsWithChildren } from 'react';


const Layout = ({ children }: PropsWithChildren) => {

    return (
        <>
            <style jsx>
                {`
                  @font-face {
                    font-family: 'AT Aero';
                    src: url('/fonts/at_aero-regular.ttf');
                  }
                  @font-face {
                    font-family: 'AT Aero Bold';
                    src: url('/fonts/at_aero-bold.ttf');
                  }
                `}
            </style>
            {/** isso aqui deve estar comentado ao fim do desenvolvimento e teste da plataforma */}
           
            <GlobalStyle />
            <SiteWrapper>
                <main>
                    {children}
                </main>
                {/* <Footer /> */}
            </SiteWrapper>
        </>
    )
}

export default Layout;


const SiteWrapper = styled.div`
    margin: auto;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    main {
        width: 100%;
    }

    @media (min-width:1365px) {
        padding-inline: 0;
    }
`