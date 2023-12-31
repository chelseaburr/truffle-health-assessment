import Head from 'next/head'
import Navbar from '@/components/Navbar'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { api, type RouterOutputs } from '@/utils/api'

type Bill = RouterOutputs['bill']['getAll'][0]

export default function Home() {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null)

  const { data: sessionData } = useSession()

  const { data: bills, refetch: refetchBills } = api.bill.getAll.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data) => {
        setSelectedBill(selectedBill ?? data[0] ?? null)
      },
    },
  )

  const deleteBill = api.bill.delete.useMutation({
    onSuccess: () => {
      void refetchBills()
    },
  })

  const openConfirmModal = () => {
    const confirmModal = document.getElementById('confirmModal')
    if (confirmModal) {
      confirmModal.showModal()
    }
  }

  const closeConfirmModal = () => {
    const confirmModal = document.getElementById('confirmModal')
    if (confirmModal) {
      confirmModal.close()
    }
  }

  return (
    <>
      <Head>
        <title>Medical Bills</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Navbar />
        <div className="my-5 ml-10 grid grid-cols-4 gap-10">
          {bills?.map((bill) => (
            <div key={bill.id}>
              <div className="card w-72 bg-base-100 shadow-xl">
                <button
                  className="btn-ghost btn-sm btn-circle btn absolute right-2 top-2"
                  onClick={openConfirmModal}
                >
                  ✕
                </button>
                <div className="card-body">
                  <p>
                    {bill.firstName} {bill.lastName}
                  </p>
                  <p>{bill.address}</p>
                  <p>{bill.hospitalName}</p>
                  <p>{bill.dateOfService}</p>
                  <p>${bill.billAmount}</p>
                </div>
              </div>
              <dialog id="confirmModal" className="modal">
                <form method="dialog" className="modal-box">
                  <button className="btn-ghost btn-sm btn-circle btn absolute right-2 top-2">
                    ✕
                  </button>
                  <div className="alert alert-warning mt-5 flex justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 shrink-0 stroke-current"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <h3 className="text-lg font-bold">Warning!</h3>
                  </div>
                  <p className="flex justify-center py-4">
                    Do you want to delete this bill?
                  </p>
                  <div className="flex justify-center">
                    <button
                      className="btn mt-5 w-full max-w-xs"
                      onClick={() => {
                        deleteBill.mutate({ id: bill.id })
                        closeConfirmModal
                      }}
                    >
                      Confirm
                    </button>
                  </div>
                </form>
              </dialog>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
