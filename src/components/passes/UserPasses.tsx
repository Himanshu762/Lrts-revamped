interface UserPassesProps {
  onPassCheck?: (hasPasses: boolean) => void; // Notify if passes are available
}

const UserPasses: React.FC<UserPassesProps> = ({ onPassCheck }) => {
  const [passes, setPasses] = useState<Pass[]>([]);
  const { user } = useClerk();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPasses = async () => {
      try {
        const { data, error } = await supabase
          .from("passes")
          .select("*")
          .eq("user_id", user?.id);
        if (error) {
          console.error("Error fetching user passes:", error);
          return;
        }
        setPasses(data || []);
        if (onPassCheck) onPassCheck((data || []).length > 0); // Notify PassesPage
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchPasses();
  }, [user, onPassCheck]);

  if (loading) {
    return <p>Loading your passes...</p>;
  }

  if (!passes.length) {
    return null; // No need to display anything if no passes are found
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {passes.map((pass) => (
        <motion.div
          key={pass.pass_secret}
          whileHover={{ translateY: -5 }}
          className={clsx(
            "relative overflow-hidden rounded-2xl",
            "bg-gradient-to-br from-white to-blue-100 dark:from-gray-800 dark:to-blue-900",
            "animate-gradient-x"
          )}
        >
          {/* Pass details */}
          <div className="p-6 space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {pass.pass_type}
            </h3>
            <p>
              <strong>Price:</strong> ₹{pass.price}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default UserPasses;