export const getServerSideProps = async (context) => {
  return {
    redirect: {
      destination: '/rightnow',
      permanent: true,
    }
  }
};

export default function Home() {
  return null;
}


