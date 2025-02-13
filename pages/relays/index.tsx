import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { MinusCircleIcon } from "@heroicons/react/24/outline";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@nextui-org/react";
import { relayInit } from "nostr-tools";

const Relays = () => {
  const [relays, setRelays] = useState([]);
  // make initial state equal to proprietary relay
  const [showModal, setShowModal] = useState(false);
  const [addNewRelayText, setAddNewRelayText] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRelays = localStorage.getItem("relays");
      setRelays(storedRelays ? JSON.parse(storedRelays) : []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("relays", JSON.stringify(relays));
  }, [relays]);

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm();

  const confirmActionDropdown = (children, header, label, func) => {
    return (
      <Dropdown backdrop="blur">
        <DropdownTrigger>{children}</DropdownTrigger>
        <DropdownMenu variant="faded" aria-label="Static Actions">
          <DropdownSection title={header} showDivider={true}></DropdownSection>
          <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            onClick={func}
          >
            {label}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  };

  const onSubmit = async (data) => {
    let relay = data["relay"];
    await addRelay(relay);
  };

  const handleToggleModal = () => {
    reset();
    setShowModal(!showModal);
  };

  const addRelay = async (newRelay: string) => {
    const relayTest = relayInit(newRelay);
    try {
      await relayTest.connect();
      setRelays([...relays, newRelay]);
      relayTest.close();
      handleToggleModal();
    } catch {
      alert(`Relay ${newRelay} was unable to connect!`);
    }
  };

  const deleteRelay = (relayToDelete) => {
    setRelays(relays.filter((relay) => relay !== relayToDelete));
  };

  return (
    <div>
      {relays.length === 0 && (
        <div className="mt-8 flex items-center justify-center">
          <p className="text-xl break-words text-center">
            No relays added . . .
          </p>
        </div>
      )}
      <div className="mt-8 mb-8 overflow-y-scroll max-h-96 bg-white rounded-md">
        {relays.map((relay) => (
          <div
            key={relay}
            className="flex justify-between items-center mb-2 border-2"
          >
            <div className="max-w-xsm truncate">{relay}</div>
            <MinusCircleIcon
              onClick={() => deleteRelay(relay)}
              className="w-5 h-5 text-red-500 hover:text-yellow-700 cursor-pointer"
            />
          </div>
        ))}
      </div>
      <div className="flex flex-row justify-between h-fit absolute w-[99vw] bottom-[0px] bg-white py-[15px] z-20 px-3">
        <Button
          className="text-white shadow-lg bg-gradient-to-tr from-purple-600 via-purple-500 to-purple-600 mx-3"
          onClick={handleToggleModal}
        >
          Add New Relay
        </Button>
      </div>
      <Modal
        backdrop="blur"
        isOpen={showModal}
        onClose={handleToggleModal}
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-60",
          // base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-black/5 active:bg-white/10",
        }}
        scrollBehavior={"outside"}
        size="2xl"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Add New Relay
          </ModalHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <Controller
                name="relay"
                control={control}
                rules={{
                  required: "A relay URL is required.",
                  maxLength: {
                    value: 300,
                    message: "This input exceed maxLength of 300.",
                  },
                  validate: (value) =>
                    /^(wss:\/\/|ws:\/\/)/.test(value) ||
                    "Invalid relay URL, must start with wss:// or ws://.",
                }}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => {
                  let isErrored = error !== undefined;
                  let errorMessage: string = error?.message
                    ? error.message
                    : "";
                  return (
                    <Textarea
                      variant="bordered"
                      fullWidth={true}
                      placeholder="wss://..."
                      isInvalid={isErrored}
                      errorMessage={errorMessage}
                      // controller props
                      onChange={onChange} // send value to hook form
                      onBlur={onBlur} // notify when input is touched/blur
                      value={value}
                    />
                  );
                }}
              />
            </ModalBody>

            <ModalFooter>
              {confirmActionDropdown(
                <Button color="danger" variant="light">
                  Cancel
                </Button>,
                "Are you sure you want to cancel?",
                "Cancel",
                handleToggleModal,
              )}

              <Button
                className="text-white shadow-lg bg-gradient-to-tr from-purple-600 via-purple-500 to-purple-600"
                type="submit"
              >
                Add Relay
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Relays;
