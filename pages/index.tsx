import { observer } from "mobx-react-lite";
import { NextLayoutPage } from "@/types/nextjs";
import CardContainer from "@/components/CardContianer/v3";
import Button from "@/components/button/v3";
import {
  Order,
  OrderStatus,
  useRecentBuyOrdersQuery,
  useRecentOrdersQuery,
  useRecentSellOrdersQuery,
} from "@/lib/algebra/graphql/generated/graphql";
import Link from "next/link";
import { wallet } from "@/services/wallet";
import { useBlockNumber } from "wagmi";
import { useEffect, useState } from "react";
import { watchBlockNumber } from "viem/actions";
import { Address, zeroAddress } from "viem";
import { ValidatedVaultAddresses } from "@/config/validatedVaultAddresses";
import {
  WarppedNextDropdown,
  WarppedNextDropdownMenu,
} from "@/components/wrappedNextUI/Dropdown/Dropdown";
import {
  DropdownItem,
  DropdownTrigger,
  SelectItem,
  Switch,
} from "@nextui-org/react";
import { popmodal } from "@/services/popmodal";
import { PressEvent } from "@react-types/shared";
import { WarppedNextSelect } from "@/components/wrappedNextUI/Select/Select";

const HomePage: NextLayoutPage = observer(() => {
  const [onlyShowPendingBuyOrders, setShowOnlyPendingBuyOrders] =
    useState<boolean>(true);
  const [onlyshowPendingSellOrders, setShowOnlyPendingSellOrders] =
    useState<boolean>(true);

  const { data: recentBuyOrders, refetch: refetchBuyOrders } =
    useRecentBuyOrdersQuery({
      variables: {
        status_in: onlyShowPendingBuyOrders
          ? [OrderStatus.Pending]
          : [OrderStatus.Pending, OrderStatus.Closed, OrderStatus.Filled],
      },
    });
  const { data: recentSellOrders, refetch: refetchSellOrders } =
    useRecentSellOrdersQuery({
      variables: {
        status_in: onlyshowPendingSellOrders
          ? [OrderStatus.Pending]
          : [OrderStatus.Pending, OrderStatus.Closed, OrderStatus.Filled],
      },
    });

  wallet.publicClient &&
    watchBlockNumber(wallet.publicClient, {
      onBlockNumber: (blockNumber) => {
        refetchBuyOrders(), refetchSellOrders();
      },
    });

  return (
    <div className="w-full flex flex-col justify-center items-center px-4 font-gliker">
      <Link href="/new-order">
        <Button>create order</Button>
      </Link>
      <div className="w-full flex gap-2">
        <CardContainer className=" justify-start">
          <div className="flex w-full justify-around">
            <h1>Sell Orders</h1>
            <Switch
              defaultSelected
              onValueChange={setShowOnlyPendingSellOrders}
            >
              <span className="text-black">only show pending</span>
            </Switch>
          </div>

          {recentSellOrders?.orders.map((order) => (
            <div
              className=" border-2 border-red-500 p-2"
              key={order.id}
            >
              <div>
                <span>order.id: </span>
                <span>{order.id}</span>
              </div>
              <div>
                <span>order.dealer.id: </span>
                <span>{order.dealer.id}</span>
              </div>
              <div>
                <span>order.balance: </span>
                <span>{order.balance}</span>
              </div>
              <div>
                <span>order.height: </span>
                <span>{order.height}</span>
              </div>
              <div>
                <span>order.orderType: </span>
                <span>{order.orderType}</span>
              </div>
              <div>
                <span>order.price: </span>
                <span>{order.price}</span>
              </div>
              <div>
                <span>order.spentBalance: </span>
                <span>{order.spentBalance}</span>
              </div>
              <div>
                <span>order.status: </span>
                <span>{order.status}</span>
              </div>
              <div>
                <span>order.vaultAddress: </span>
                <span>{order.vaultAddress}</span>
              </div>
              <div>
                {order.dealer.id.toLowerCase() ===
                  wallet.account.toLowerCase() &&
                  order.status === "Pending" && (
                    <Button
                      disabled={!wallet.walletClient || !wallet.isInit}
                      isDisabled={!wallet.walletClient || !wallet.isInit}
                      onPress={() => {
                        wallet.contracts.bgtMarket.closeOrder(BigInt(order.id));
                      }}
                    >
                      {!wallet.walletClient ? "Connect Wallet" : "Close Order"}
                    </Button>
                  )}

                {!(
                  order.dealer.id.toLowerCase() === wallet.account.toLowerCase()
                ) &&
                  order.status === "Pending" && (
                    <Button
                      disabled={!wallet.walletClient || !wallet.isInit}
                      isDisabled={!wallet.walletClient || !wallet.isInit}
                      onPress={() => {
                        wallet.contracts.bgtMarket.fillSellOrder(
                          BigInt(order.id)
                        );
                      }}
                    >
                      {!wallet.walletClient ? "Connect Wallet" : "Fill Order"}
                    </Button>
                  )}
              </div>
            </div>
          ))}
        </CardContainer>
        <CardContainer className=" justify-start">
          <div className="flex w-full justify-around">
            <h1>Buy Orders</h1>
            <Switch
              defaultSelected
              onValueChange={setShowOnlyPendingBuyOrders}
            >
              <span className="text-black">only show pending</span>
            </Switch>
          </div>
          {recentBuyOrders?.orders.map((order) => (
            <div
              className=" border-2 border-red-500 p-2"
              key={order.id}
            >
              <div>
                <span>order.id: </span>
                <span>{order.id}</span>
              </div>
              <div>
                <span>order.dealer.id: </span>
                <span>{order.dealer.id}</span>
              </div>
              <div>
                <span>order.balance: </span>
                <span>{order.balance}</span>
              </div>
              <div>
                <span>order.height: </span>
                <span>{order.height}</span>
              </div>
              <div>
                <span>order.orderType: </span>
                <span>{order.orderType}</span>
              </div>
              <div>
                <span>order.price: </span>
                <span>{order.price}</span>
              </div>
              <div>
                <span>order.spentBalance: </span>
                <span>{order.spentBalance}</span>
              </div>
              <div>
                <span>order.status: </span>
                <span>{order.status}</span>
              </div>
              <div>
                <span>order.vaultAddress: </span>
                <span>{order.vaultAddress}</span>
              </div>
              <div>
                {order.dealer.id.toLowerCase() ===
                  wallet.account.toLowerCase() &&
                  order.status === "Pending" && (
                    <Button
                      disabled={!wallet.walletClient || !wallet.isInit}
                      isDisabled={!wallet.walletClient || !wallet.isInit}
                      onPress={() => {
                        wallet.contracts.bgtMarket.closeOrder(BigInt(order.id));
                      }}
                    >
                      {!wallet.walletClient ? "Connect Wallet" : "Close Order"}
                    </Button>
                  )}

                {!(
                  order.dealer.id.toLowerCase() === wallet.account.toLowerCase()
                ) &&
                  order.status === "Pending" && (
                    <FillBuyOrderModalButton order={order as Order} />
                    // <Button
                    //   disabled={!wallet.walletClient || !wallet.isInit}
                    //   isDisabled={!wallet.walletClient || !wallet.isInit}
                    //   onPress={() => {
                    //     wallet.contracts.bgtMarket.fillBuyOrder(
                    //       BigInt(order.id),
                    //       zeroAddress
                    //     );
                    //   }}
                    // >
                    //   {!wallet.walletClient ? "Connect Wallet" : "Fill Order"}
                    // </Button>
                  )}
              </div>
            </div>
          ))}
        </CardContainer>
      </div>
    </div>
  );
});

const FillBuyOrderModalButton = ({ order }: { order: Order }) => {
  const handleClick = (e: PressEvent) => {
    popmodal.openModal({
      content: <FillBuyOrderModal order={order} />,
      boarderLess: true,
    });
  };

  return (
    <Button
      disabled={!wallet.walletClient || !wallet.isInit}
      isDisabled={!wallet.walletClient || !wallet.isInit}
      onPress={(e) => {
        handleClick(e);
      }}
    >
      {!wallet.walletClient ? "Connect Wallet" : "Fill Order"}
    </Button>
  );
};

const FillBuyOrderModal = ({ order }: { order: Order }) => {
  const [selectedVault, setSelectedVault] = useState<Address | undefined>(
    undefined
  );

  const handleClick = () => {
    if (!selectedVault) return;
    wallet.contracts.bgtMarket.fillBuyOrder(BigInt(order.id), selectedVault);
  };

  return (
    <CardContainer className="flex flex-col gap-2">
      <div className="min-w-[500px] flex gap-2 flex-col">
        <label>Vault Address</label>
        <WarppedNextSelect
          isRequired
          items={Object.entries(ValidatedVaultAddresses)}
          defaultSelectedKeys={[Object.keys(ValidatedVaultAddresses)[0]]}
          onSelectionChange={(e) => {
            setSelectedVault(e.currentKey?.toLowerCase() as Address);
          }}
        >
          {Object.entries(ValidatedVaultAddresses).map(([key, value]) => (
            <SelectItem
              key={key}
              value={key}
            >
              {value}({key})
            </SelectItem>
          ))}
        </WarppedNextSelect>

        <Button
          disabled={!wallet.walletClient || !wallet.isInit}
          isDisabled={!wallet.walletClient || !wallet.isInit}
          onPress={() => {
            handleClick();
          }}
        >
          {!wallet.walletClient ? "Connect Wallet" : "Fill Order"}
        </Button>
      </div>
    </CardContainer>
  );
};

export default HomePage;
