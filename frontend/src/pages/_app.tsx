import Layout from '../base/Layout';

// barra de carregamento
import Router from 'next/router';

function MyApp({ Component, pageProps }) {

    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>

    )
}

export default MyApp;