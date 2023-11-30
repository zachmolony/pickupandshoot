import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({request}: LoaderFunctionArgs) {
  // throw new Response(`${new URL(request.url).pathname} not found`, {
  //   status: 507,
  // });
  return null;
}

export default function ErrorPage() {
  return (
    <div
      className="flex flex-col justify-center w-full h-full"
      style={{fontSize: '1rem'}}
    >
      <>/Error 777/</>
      <br />
      <>Physical storage could not be read.</>
      <br />
      <span className="mt-2 text-sm">
        Unmounting /dev/storage/vhs0: FAILURE
      </span>
      <span className="mb-2 text-sm">
        {'>'} trace: {'{'}read_err, vhs_track, recalibrate{'}'}
      </span>
      <>[!] Please eject the cassette and power cycle the device</>
      {/* <p>[!] CONTACT: Support at 1-777-PUAS for further assistance.</p> */}
    </div>
  );
}
