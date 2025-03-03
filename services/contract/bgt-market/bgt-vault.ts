import { BaseContract } from "./..";
import { wallet } from "@/services/wallet";
import { makeAutoObservable } from "mobx";
import { Address, getContract, zeroAddress } from "viem";
import { ICHIVaultFactoryABI } from "@/lib/abis/aquabera/ICHIVaultFactory";
import { ContractWrite } from "@/services/utils";
import { RewardVaultABI } from "@/lib/abis/bgt-market/RewardVaultABI";

export class BGTVault implements BaseContract {
  address: Address = zeroAddress;
  name: string = "BGTMarket";
  abi = RewardVaultABI;

  constructor(args: Partial<BGTVault>) {
    Object.assign(this, args);
    makeAutoObservable(this);
  }

  get contract() {
    return getContract({
      address: this.address as `0x${string}`,
      abi: this.abi,
      client: { public: wallet.publicClient, wallet: wallet.walletClient },
    });
  }

  async setOperatorIfNot(clientAddress: Address, OperatorAddress: Address) {
    const vaultOperator = await this.ReadOperator(
      clientAddress.toLowerCase() as Address
    );

    if (vaultOperator.toLowerCase() != OperatorAddress.toLowerCase()) {
      await this.setOperator(OperatorAddress.toLowerCase() as Address);
    }
  }

  ReadOperator(account: Address) {
    return this.contract.read.operator([account]);
  }

  setOperator(account: Address) {
    return new ContractWrite(this.contract.write.setOperator, {
      action: "Setting Vault Operator",
    }).call([account]);
  }
}
