import { observer } from "mobx-react-lite";
import { NextLayoutPage } from "@/types/nextjs";
import CardContainer from "@/components/CardContianer/v3";
import Button from "@/components/button/v3";
import { OrderType } from "@/lib/algebra/graphql/generated/graphql";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { HoneyContainer } from "@/components/CardContianer";
import { WarppedNextSelect } from "@/components/wrappedNextUI/Select/Select";
import { SelectItem } from "@nextui-org/react";
import { wallet } from "@/services/wallet";
import { Address, parseEther, zeroAddress } from "viem";
import { simulateContract } from "viem/actions";
import { useMemo, useState } from "react";
import { ValidatedVaultAddresses } from "@/config/validatedVaultAddresses";

type FormValues = {
  price: string;
  orderType: OrderType;
  vaultAddress?: string;
  orderBuyValue?: string;
};

const PostOrderModal: NextLayoutPage = observer(() => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<FormValues>({
    defaultValues: {
      orderType: OrderType.BuyBgt,
      vaultAddress: Object.keys(ValidatedVaultAddresses)[0],
    },
  });
  const router = useRouter();
  const [buyOrSell, setBuyOrSell] = useState<OrderType | undefined>(
    OrderType.BuyBgt
  );
  const [buyOrSelLoading, setBuyOrSellLoading] = useState<boolean>(false);

  const onSubmit = async (data: FormValues) => {
    setBuyOrSellLoading(true);
    console.log(data);
    if (OrderType.BuyBgt === data.orderType) {
      console.log("buy");
      const orderTransaction = wallet.contracts.bgtMarket.postBuyOrder(
        BigInt(data.price),
        BigInt(parseEther(data.orderBuyValue ?? "0"))
      );

      await orderTransaction;
    } else {
      console.log("sell");
      const orderTransaction = wallet.contracts.bgtMarket.postSellOrder(
        BigInt(data.price),
        (data.vaultAddress ?? zeroAddress) as Address
      );
      await orderTransaction;
    }

    setBuyOrSellLoading(false);
  };

  return (
    <div className="w-full md:p-6 md:max-w-full xl:max-w-[1200px] mx-auto">
      <div className="flex flex-col px-4 md:px-0 w-full md:w-[584px] lg:w-[900px] mx-auto">
        <div className="flex items-center justify-center mt-4 md:mt-8">
          <div className="flex w-full items-center justify-center">
            <HoneyContainer>
              <div className="flex items-center gap-2">
                <span className="text-black text-base md:text-xl font-bold text-center">
                  Create Order
                </span>
              </div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full rounded-[24px] md:rounded-[32px] bg-white space-y-5 px-4 md:px-8 py-4 md:py-6 custom-dashed mx-3 md:mx-6 mt-4 md:mt-6"
              >
                <div className="flex flex-col gap-2">
                  <label>Order Type</label>
                  <WarppedNextSelect
                    isRequired
                    items={Object.entries(OrderType)}
                    defaultSelectedKeys={[Object.values(OrderType)[0]]}
                    selectorIcon={<></>}
                    selectionMode="single"
                    onSelectionChange={(e) => {
                      console.log(e);
                      if ((e.currentKey as OrderType) === buyOrSell) {
                        setBuyOrSell(undefined);
                      } else {
                        setBuyOrSell(e.currentKey as OrderType);
                      }
                    }}
                    {...register("orderType")}
                  >
                    {Object.entries(OrderType).map(([key, value]) => (
                      <SelectItem
                        key={value}
                        value={value}
                      >
                        {value}
                      </SelectItem>
                    ))}
                  </WarppedNextSelect>
                </div>

                {buyOrSell !== undefined && (
                  <>
                    <div className="flex flex-col gap-2">
                      <label>Price BGT Per Bera</label>
                      <input
                        type="text"
                        {...register("price", { required: true })}
                        className={
                          "w-full bg-white rounded-[12px] md:rounded-[16px] px-3 md:px-4 py-2 md:py-[18px] text-black outline-none border border-black shadow-[0px_332px_93px_0px_rgba(0,0,0,0.00),0px_212px_85px_0px_rgba(0,0,0,0.01),0px_119px_72px_0px_rgba(0,0,0,0.05),0px_53px_53px_0px_rgba(0,0,0,0.09),0px_13px_29px_0px_rgba(0,0,0,0.10)] placeholder:text-black/50 text-sm md:text-base font-medium h-[40px] md:h-[60px]"
                        }
                        placeholder="Enter Price"
                      />
                      {errors.price && (
                        <span className="text-red-500 text-sm">
                          Price is required
                        </span>
                      )}
                    </div>

                    {buyOrSell === OrderType.BuyBgt && (
                      <div className="flex flex-col gap-2">
                        <label>Buying Amount(Bera)</label>
                        <input
                          type="text"
                          {...register("orderBuyValue", { required: true })}
                          className={
                            "w-full bg-white rounded-[12px] md:rounded-[16px] px-3 md:px-4 py-2 md:py-[18px] text-black outline-none border border-black shadow-[0px_332px_93px_0px_rgba(0,0,0,0.00),0px_212px_85px_0px_rgba(0,0,0,0.01),0px_119px_72px_0px_rgba(0,0,0,0.05),0px_53px_53px_0px_rgba(0,0,0,0.09),0px_13px_29px_0px_rgba(0,0,0,0.10)] placeholder:text-black/50 text-sm md:text-base font-medium h-[40px] md:h-[60px]"
                          }
                          placeholder="Enter Buying Amount"
                        />
                        {errors.orderBuyValue && (
                          <span className="text-red-500 text-sm">
                            Buying Amount
                          </span>
                        )}
                      </div>
                    )}

                    {buyOrSell === OrderType.SellBgt && (
                      <div className="flex flex-col gap-2">
                        <label>Vault Address</label>
                        <WarppedNextSelect
                          isRequired
                          items={Object.entries(ValidatedVaultAddresses)}
                          defaultSelectedKeys={[
                            Object.keys(ValidatedVaultAddresses)[0],
                          ]}
                          selectorIcon={<></>}
                          {...register("vaultAddress")}
                        >
                          {Object.entries(ValidatedVaultAddresses).map(
                            ([key, value]) => (
                              <SelectItem
                                key={key}
                                value={key}
                              >
                                {value}
                              </SelectItem>
                            )
                          )}
                        </WarppedNextSelect>
                      </div>
                    )}
                  </>
                )}
                <Button
                  type="submit"
                  disabled={!wallet.walletClient || buyOrSelLoading}
                  isLoading={buyOrSelLoading}
                  className="w-full bg-black text-white font-bold rounded-[12px] md:rounded-[16px] px-3 py-2 md:py-[18px] border-2 border-black hover:bg-black/90 text-sm md:text-base h-[40px] md:h-[60px]"
                >
                  {!wallet.isInit ? "Connect Wallet" : "Create Order"}
                </Button>
              </form>
              {/* 移除底部边框 */}
            </HoneyContainer>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PostOrderModal;
