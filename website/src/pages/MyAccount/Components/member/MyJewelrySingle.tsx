import React, { useEffect, useState } from 'react'
import { RequestApproval } from '../../../../models/RequestApproval';
import { Jewelry } from '../../../../models/Jewelry';
import { User } from '../../../../models/User';
import { Image } from '../../../../models/Image';
import { getIconImageByJewelryId, getImagesByJewelryId } from '../../../../api/ImageApi';
import { formatNumberAcceptNull } from '../../../../utils/formatNumber';
import { ConfirmModal, RefuseJewelryRequestModal } from '../../Modal/Modal';
import { StateJewelry } from './StateJewelry';
type MyJewelrySingleProps = {
  jewelry: Jewelry | undefined;
  user: User | null,
  handleChangeList: () => Promise<void>
}
const MyJewelrySingle: React.FC<MyJewelrySingleProps> = ({ jewelry, user, handleChangeList }) => {
  const [image, setImage] = useState<Image | null>(null)
  const [images, setImages] = useState<Image[]>([])
  useEffect(() => {
    getIconImageByJewelryId(jewelry?.id ? jewelry.id : 1)
      .then((response) => {
        setImage(response);
      })
      .catch((error) => {
        console.error(error.message);
      });

    getImagesByJewelryId(jewelry?.id ? jewelry.id : 1)
      .then((response) => {
        setImages(response);
      })
      .catch((error) => {
        console.error(error.message);
      });
    console.log(jewelry);

  }, [])

  return (
    <>
      <tr>
        <td>
          {jewelry?.id}
        </td>
        <td className="text-start">
          {jewelry?.name}
        </td>
        <td><img style={{ width: '60px', height: '60px' }} src={image?.data} alt='jewelry' /></td>
        {/* <td className='fw-semibold'>
          {formatNumberAcceptNull(request?.desiredPrice)}
        </td> */}
        <td className='fw-semibold text-success'>
          <StateJewelry state={jewelry?.state ? jewelry?.state : 'HIDDEN'} />
        </td>
        <td >
          {/* <ConfirmModal jewelry={jewelry} images={images} user={user} request={request} handleChangeList={handleChangeList} />
          <RefuseJewelryRequestModal jewelry={jewelry} request={request} user={user} handleChangeList={handleChangeList} /> */}
        </td>
      </tr>
    </>
  )
}

export default MyJewelrySingle
