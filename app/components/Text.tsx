import {Link} from '@remix-run/react';

const Text = ({colour = 'default', children}) => {
  const col = {
    default: 'text-white',
    white: 'bg-white text-slate-700 text-center',
    green: 'bg-puas-green text-slate-700 w-9/12',
  };
  return (
    <div style={{height: '1.3rem'}} className={`px-2 w-full ` + col[colour]}>
      <span>{children}</span>
    </div>
  );
};

// const TextLink = ({link}) => {
//   return (

//     <Link
//       className="collection-item"
//       key={collection.id}
//       to={link}
//       prefetch="intent"
//     >
//       <h5>{childer}</h5>
//     </Link>
//   )
// }

export default Text;
