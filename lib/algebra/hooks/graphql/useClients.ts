import {
  infoClient,
  blocksClient,
  farmingClient,
  bgtClient,
} from "../../graphql/clients";

export function useClients() {
  return {
    infoClient,
    blocksClient,
    farmingClient,
    bgtClient,
  };
}
